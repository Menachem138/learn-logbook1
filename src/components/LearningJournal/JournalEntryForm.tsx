import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextEditorToolbar } from './TextEditorToolbar';

interface JournalEntryFormProps {
  newEntry: string;
  setNewEntry: (value: string) => void;
  addEntry: (isImportant: boolean) => void;
}

export function JournalEntryForm({ newEntry, setNewEntry, addEntry }: JournalEntryFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newEntry.substring(start, end);

    if (format === '- ') {
      // Handle list items differently
      const newText = `${newEntry.substring(0, start)}- ${selectedText}${newEntry.substring(end)}`;
      setNewEntry(newText);
      
      // Set cursor position after the list marker
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2 + selectedText.length);
      }, 0);
    } else {
      // Handle other formatting
      const newText = `${newEntry.substring(0, start)}${format}${selectedText}${format}${newEntry.substring(end)}`;
      setNewEntry(newText);
      
      // Set cursor position inside the formatting marks if no text was selected
      setTimeout(() => {
        textarea.focus();
        if (start === end) {
          textarea.setSelectionRange(start + format.length, start + format.length);
        } else {
          textarea.setSelectionRange(start, end + format.length * 2);
        }
      }, 0);
    }
  };

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border">
      <TextEditorToolbar onFormatText={handleFormatText} />
      <Textarea
        ref={textareaRef}
        placeholder="מה למדת היום?"
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        className="min-h-[100px] text-right"
        dir="rtl"
      />
      <div className="flex gap-2 justify-end">
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