import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import { documentService } from '../services/DocumentService';
import type { Document } from '../components/Documents/types';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const formData = {
          title: result.name,
          file: {
            uri: result.uri,
            type: result.mimeType || 'application/octet-stream',
            name: result.name,
          },
        };

        await documentService.uploadDocument(formData);
        loadDocuments();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>מסמכים</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          disabled={uploading}
        >
          <Icon name="upload" size={24} color="#4285F4" />
          <Text style={styles.uploadButtonText}>
            {uploading ? 'מעלה...' : 'העלאת מסמך'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <View style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Icon 
                name="file-document-outline" 
                size={24} 
                color="#4285F4" 
                style={styles.documentIcon}
              />
              <View style={styles.documentDetails}>
                <Text style={styles.documentTitle}>{item.title}</Text>
                <Text style={styles.documentDate}>
                  {new Date(item.created_at).toLocaleDateString('he-IL')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Icon name="delete-outline" size={24} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-outline" size={48} color="#666666" />
            <Text style={styles.emptyText}>אין מסמכים עדיין</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.heading3,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  uploadButtonText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  list: {
    padding: theme.spacing.md,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow.small,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    marginRight: theme.spacing.sm,
  },
  documentDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  documentDate: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
