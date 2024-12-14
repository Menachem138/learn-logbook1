import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntryForm } from './JournalEntryForm';
import { JournalEntry } from './JournalEntry';
import { useToast } from '@/components/ui/use-toast';

export default function LearningJournal() {
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('learning_journal')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async ({ content, isImportant }: { content: string; isImportant: boolean }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('learning_journal')
        .insert([{ 
          content, 
          is_important: isImportant,
          user_id: session.session.user.id 
        }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      setNewEntry('');
      toast({
        title: 'הרשומה נוספה בהצלחה',
        description: 'הרשומה החדשה נוספה ליומן הלמידה שלך',
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, content, isImportant }: { id: string; content: string; isImportant: boolean }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('learning_journal')
        .update({ content, is_important: isImportant })
        .eq('id', id)
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      setEditingEntry(null);
      toast({
        title: 'הרשומה עודכנה בהצלחה',
        description: 'השינויים נשמרו ביומן הלמידה שלך',
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('learning_journal')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: 'הרשומה נמחקה בהצלחה',
        description: 'הרשומה הוסרה מיומן הלמידה שלך',
      });
    },
  });

  const handleAddEntry = (isImportant: boolean) => {
    if (!newEntry.trim()) return;
    addEntryMutation.mutate({ content: newEntry, isImportant });
  };

  const handleUpdateEntry = (entry: any) => {
    if (editingEntry) {
      updateEntryMutation.mutate({
        id: entry.id,
        content: entry.content,
        isImportant: entry.is_important,
      });
    } else {
      setEditingEntry(entry);
      setNewEntry(entry.content);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק רשומה זו?')) {
      deleteEntryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">יומן למידה</h2>
      
      <JournalEntryForm
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        addEntry={handleAddEntry}
      />

      <div className="space-y-4">
        {entries.map((entry) => (
          <JournalEntry
            key={entry.id}
            entry={entry}
            onEdit={handleUpdateEntry}
            onDelete={handleDeleteEntry}
          />
        ))}
      </div>
    </div>
  );
}