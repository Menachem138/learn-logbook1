import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { pickImage, uploadToCloudinary } from '../../utils/media';
import type { JournalFormData } from './types';

interface JournalFormProps {
  onSubmit: (data: JournalFormData) => Promise<void>;
  initialData?: Partial<JournalFormData>;
}

export function JournalForm({ onSubmit, initialData }: JournalFormProps) {
  const [formData, setFormData] = useState<JournalFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    images: initialData?.images || [],
    tags: initialData?.tags || [],
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await pickImage();
      if (result) {
        const uploadResult = await uploadToCloudinary(result.uri);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), uploadResult.url],
        }));
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="כותרת"
        value={formData.title}
        onChangeText={title => setFormData(prev => ({ ...prev, title }))}
        textAlign="right"
      />

      <TextInput
        style={styles.contentInput}
        placeholder="תוכן"
        value={formData.content}
        onChangeText={content => setFormData(prev => ({ ...prev, content }))}
        multiline
        textAlign="right"
      />

      <View style={styles.imagesContainer}>
        {formData.images?.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
        <TouchableOpacity style={styles.addImageButton} onPress={handleImagePick}>
          <Text style={styles.addImageButtonText}>הוסף תמונה</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsSection}>
        <View style={styles.tagInput}>
          <TextInput
            style={styles.tagInputField}
            placeholder="תגית חדשה"
            value={newTag}
            onChangeText={setNewTag}
            onSubmitEditing={handleAddTag}
            textAlign="right"
          />
          <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
            <Text style={styles.addTagButtonText}>הוסף</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {formData.tags?.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => handleRemoveTag(index)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'שומר...' : 'שמור'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  contentInput: {
    fontSize: 16,
    minHeight: 150,
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addImageButtonText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  tagsSection: {
    marginBottom: 15,
  },
  tagInput: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagInputField: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  addTagButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
