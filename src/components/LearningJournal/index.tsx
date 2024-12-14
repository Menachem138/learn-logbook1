import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntryForm } from './JournalEntryForm';
import { JournalEntry } from './JournalEntry';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JournalEntryType {
  id: string;
  content: string;
  created_at: string;
  is_important: boolean;
  user_id: string;
}

export default function LearningJournal() {
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('learning_journal')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success('הרשומה נמחקה בהצלחה');
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (entry: JournalEntryType) => {
      const { error } = await supabase
        .from('learning_journal')
        .update({ content: entry.content })
        .eq('id', entry.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      setIsEditing(false);
      setEditingEntry(null);
      toast.success('הרשומה עודכנה בהצלחה');
    },
  });

  const handleAddEntry = (isImportant: boolean) => {
    if (!newEntry.trim()) return;
    addEntryMutation.mutate({ content: newEntry, isImportant });
  };

  const handleEditEntry = (entry: JournalEntryType) => {
    setEditingEntry(entry);
    setIsEditing(true);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry) return;
    updateEntryMutation.mutate(editingEntry);
  };

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-right">יומן למידה</h2>
        <h3 className="text-lg text-muted-foreground mb-4 text-right">מה למדת היום?</h3>
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
            onEdit={() => handleEditEntry(entry)}
            onDelete={() => deleteEntryMutation.mutate(entry.id)}
          />
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ערוך רשומה</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editingEntry?.content || ""}
            onChange={(e) => setEditingEntry(editingEntry ? { ...editingEntry, content: e.target.value } : null)}
            className="min-h-[200px]"
            dir="rtl"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleUpdateEntry}>שמור שינויים</Button>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setEditingEntry(null);
            }}>
              ביטול
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}