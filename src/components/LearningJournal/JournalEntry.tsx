import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { JournalEntry as JournalEntryType } from './types';

interface JournalEntryProps {
  entry: JournalEntryType;
  onPress?: () => void;
}

export function JournalEntry({ entry, onPress }: JournalEntryProps) {
  const formattedDate = new Date(entry.created_at).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>

      {entry.images && entry.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: entry.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          {entry.images.length > 1 && (
            <View style={styles.moreImagesOverlay}>
              <Text style={styles.moreImagesText}>+{entry.images.length - 1}</Text>
            </View>
          )}
        </View>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {entry.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  imageContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderTopLeftRadius: 8,
  },
  moreImagesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});
