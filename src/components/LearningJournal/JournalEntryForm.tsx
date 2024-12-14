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

    if (format.endsWith(' ')) {
      // Handle lists and quotes
      const newText = `${newEntry.substring(0, start)}${format}${selectedText}${newEntry.substring(end)}`;
      setNewEntry(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + format.length, start + format.length + selectedText.length);
      }, 0);
    } else {
      // Handle text formatting (bold, italic, underline)
      const newText = `${newEntry.substring(0, start)}${format}${selectedText}${format}${newEntry.substring(end)}`;
      setNewEntry(newText);
      
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
    <div className="space-y-4 bg-white rounded-lg border shadow-sm">
      <TextEditorToolbar onFormatText={handleFormatText} />
      <div className="px-4 pb-4">
        <Textarea
          ref={textareaRef}
          placeholder="מה למדת היום?"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="min-h-[150px] text-right bg-white resize-none"
          dir="rtl"
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => addEntry(true)}
            className="bg-white hover:bg-gray-50"
          >
            הוסף כהערה חשובה
          </Button>
          <Button 
            onClick={() => addEntry(false)}
            className="bg-black hover:bg-black/90 text-white"
          >
            הוסף רשומה
          </Button>
        </div>
      </div>
    </div>
  );
}
