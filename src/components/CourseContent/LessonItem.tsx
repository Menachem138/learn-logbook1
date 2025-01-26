import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { LessonItemProps } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function LessonItem({ lesson, onPress, progress }: LessonItemProps) {
  const isCompleted = progress?.completed;
  const hasProgress = progress?.progress && progress.progress > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{lesson.title}</Text>
          {lesson.duration && (
            <Text style={styles.duration}>
              {Math.floor(lesson.duration / 60)} דקות
            </Text>
          )}
        </View>
        
        {lesson.description && (
          <Text style={styles.description} numberOfLines={2}>
            {lesson.description}
          </Text>
        )}

        {hasProgress && !isCompleted && (
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: progress?.progress ? `${progress.progress}%` : '0%' }
              ]} 
            />
          </View>
        )}
      </View>

      <View style={styles.iconContainer}>
        {isCompleted ? (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        ) : (
          <Icon 
            name={
              lesson.type === 'video' ? 'play-circle-outline' :
              lesson.type === 'quiz' ? 'help-circle-outline' :
              'text'
            }
            size={24}
            color="#666"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
});
