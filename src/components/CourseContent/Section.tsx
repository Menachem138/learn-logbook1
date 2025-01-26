import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LessonItem } from './LessonItem';
import type { SectionProps } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function Section({ section, onLessonPress, progress }: SectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const completedLessons = section.lessons.filter(
    lesson => progress[lesson.id]?.completed
  ).length;

  const progressPercentage = 
    (completedLessons / section.lessons.length) * 100;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleExpanded}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{section.title}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              {completedLessons}/{section.lessons.length} שיעורים הושלמו
            </Text>
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#666"
            />
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={styles.content}>
          {section.lessons.map(lesson => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              onPress={() => onLessonPress(lesson)}
              progress={progress[lesson.id]}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  content: {
    padding: 15,
    paddingTop: 0,
  },
});
