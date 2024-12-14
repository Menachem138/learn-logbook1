import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntryForm } from './JournalEntryForm';
import { JournalEntry } from './JournalEntry';
import { toast } from "sonner";

export default function LearningJournal() {
  const [newEntry, setNewEntry] = useState('');
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
      toast.success('הרשומה נוספה בהצלחה');
    },
  });

  const handleAddEntry = (isImportant: boolean) => {
    if (!newEntry.trim()) return;
    addEntryMutation.mutate({ content: newEntry, isImportant });
  };

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">יומן למידה</h2>
        <h3 className="text-lg text-muted-foreground mb-4">מה למדת היום?</h3>
      </div>
      
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
          />
        ))}
      </div>
    </div>
  );
}