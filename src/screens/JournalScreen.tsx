import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  I18nManager,
} from 'react-native';
import { JournalEntry } from '../components/LearningJournal/JournalEntry';
import { JournalForm } from '../components/LearningJournal/JournalForm';
import { journalService } from '../services/JournalService';
import type { JournalEntry as JournalEntryType, JournalFormData } from '../components/LearningJournal/types';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(null);

  const loadEntries = async () => {
    try {
      const data = await journalService.getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEntries();
  };

  const handleSubmit = async (formData: JournalFormData) => {
    try {
      if (selectedEntry) {
        await journalService.updateEntry(selectedEntry.id, formData);
      } else {
        await journalService.createEntry(formData);
      }
      setShowForm(false);
      setSelectedEntry(null);
      loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEntryPress = (entry: JournalEntryType) => {
    setSelectedEntry(entry);
    setShowForm(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (showForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setShowForm(false);
              setSelectedEntry(null);
            }}
          >
            <Text style={styles.headerButtonText}>חזור</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedEntry ? 'ערוך רשומה' : 'רשומה חדשה'}
          </Text>
        </View>
        <JournalForm
          onSubmit={handleSubmit}
          initialData={selectedEntry || undefined}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>יומן למידה</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.headerButtonText}>חדש</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={entries}
        renderItem={({ item }) => (
          <JournalEntry entry={item} onPress={() => handleEntryPress(item)} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
    flexDirection: 'row-reverse', // RTL support
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
    textAlign: 'right', // RTL support
    flex: 1,
    marginRight: theme.spacing.md, // RTL support
  },
  headerButton: {
    padding: theme.spacing.sm,
    flexDirection: 'row-reverse', // RTL support
    alignItems: 'center',
  },
  headerButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
    marginRight: theme.spacing.xs, // RTL support
  },
  list: {
    padding: theme.spacing.md,
    alignItems: 'flex-end', // RTL support
  },
});
