import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { JournalEntry } from '../components/LearningJournal/JournalEntry';
import { JournalForm } from '../components/LearningJournal/JournalForm';
import { journalService } from '../services/JournalService';
import type { JournalEntry as JournalEntryType, JournalFormData } from '../components/LearningJournal/types';

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
    backgroundColor: '#f5f5f5',
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
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
});
