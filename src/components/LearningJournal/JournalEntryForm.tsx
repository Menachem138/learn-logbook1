import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextEditorToolbar } from './TextEditorToolbar';

interface JournalEntryFormProps {
  newEntry: string;
  setNewEntry: (value: string) => void;
  addEntry: (isImportant: boolean) => void;
}

export function JournalEntryForm({ newEntry, setNewEntry, addEntry }: JournalEntryFormProps) {
  const handleFormatText = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newEntry.substring(start, end);

    if (format === '- ') {
      // Handle list items differently
      const newText = `${newEntry.substring(0, start)}- ${selectedText}${newEntry.substring(end)}`;
      setNewEntry(newText);
    } else {
      // Handle other formatting
      const newText = `${newEntry.substring(0, start)}${format}${selectedText}${format}${newEntry.substring(end)}`;
      setNewEntry(newText);
    }
  };

  return (
    <div className="space-y-4">
      <TextEditorToolbar onFormatText={handleFormatText} />
      <Textarea
        placeholder="מה למדת היום?"
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        className="min-h-[100px] text-right"
        dir="rtl"
      />
      <div className="flex space-x-2">
        <Button onClick={() => addEntry(false)} className="flex-1">
          הוסף רשומה
        </Button>
        <Button onClick={() => addEntry(true)} variant="secondary" className="flex-1">
          הוסף כהערה חשובה
        </Button>
      </div>
    </div>
  );
}