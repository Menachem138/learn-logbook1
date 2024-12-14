import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntryForm } from "./JournalEntryForm";
import { JournalEntry } from "./JournalEntry";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  is_important: boolean;
  user_id: string;
}

export default function LearningJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("יש להתחבר כדי לצפות ביומן");
        return;
      }

      const { data, error } = await supabase
        .from('learning_journal')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast.error("שגיאה בטעינת היומן");
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (isImportant: boolean = false) => {
    if (!newEntry.trim()) {
      toast.error("אנא הכנס תוכן ליומן");
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("יש להתחבר כדי להוסיף רשומה");
        return;
      }

      const { data, error } = await supabase
        .from('learning_journal')
        .insert([{
          content: newEntry,
          is_important: isImportant,
          user_id: session.session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries([data, ...entries]);
        setNewEntry("");
        toast.success("הרשומה נוספה בהצלחה!");
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error("שגיאה בהוספת רשומה");
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('learning_journal')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
      toast.success("הרשומה נמחקה בהצלחה!");
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error("שגיאה במחיקת רשומה");
    }
  };

  const updateEntry = async () => {
    if (!editingEntry) return;

    try {
      const { error } = await supabase
        .from('learning_journal')
        .update({ content: editingEntry.content })
        .eq('id', editingEntry.id);

      if (error) throw error;

      setEntries(entries.map(entry =>
        entry.id === editingEntry.id ? editingEntry : entry
      ));
      setIsEditing(false);
      setEditingEntry(null);
      toast.success("הרשומה עודכנה בהצלחה!");
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error("שגיאה בעדכון רשומה");
    }
  };

  if (loading) {
    return <div className="text-right">טוען...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-right">יומן למידה</h2>
      <JournalEntryForm
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        addEntry={addEntry}
      />
      <div className="mt-6 space-y-4">
        {entries.map((entry) => (
          <JournalEntry
            key={entry.id}
            entry={entry}
            onEdit={(entry) => {
              setEditingEntry(entry);
              setIsEditing(true);
            }}
            onDelete={deleteEntry}
          />
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">ערוך רשומה</DialogTitle>
          </DialogHeader>
          <JournalEntryForm
            newEntry={editingEntry?.content || ""}
            setNewEntry={(content) => setEditingEntry(editingEntry ? { ...editingEntry, content } : null)}
            addEntry={() => updateEntry()}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}